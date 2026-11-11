import AVFoundation
import Speech

enum SpeechError: LocalizedError {
    case unavailable(Language)

    var errorDescription: String? {
        switch self {
        case .unavailable(let language):
            return "Spraakherkenning voor \(language.name) is nu niet beschikbaar."
        }
    }
}

/// Zet spraak om in tekst. Gebruikt herkenning op het toestel zelf zodra iOS dat voor de taal ondersteunt.
@MainActor
final class SpeechRecognizer: ObservableObject {
    @Published var transcript = ""

    private let audioEngine = AVAudioEngine()
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?

    nonisolated static func requestPermissions() async -> Bool {
        let speech = await withCheckedContinuation { (continuation: CheckedContinuation<Bool, Never>) in
            SFSpeechRecognizer.requestAuthorization { status in
                continuation.resume(returning: status == .authorized)
            }
        }
        let microphone = await AVAudioApplication.requestRecordPermission()
        return speech && microphone
    }

    nonisolated static func supportsOnDevice(_ language: Language) -> Bool {
        SFSpeechRecognizer(locale: Locale(identifier: language.speechIdentifier))?.supportsOnDeviceRecognition ?? false
    }

    func start(language: Language) throws {
        cancel()
        transcript = ""

        guard let recognizer = SFSpeechRecognizer(locale: Locale(identifier: language.speechIdentifier)),
              recognizer.isAvailable else {
            throw SpeechError.unavailable(language)
        }

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        if recognizer.supportsOnDeviceRecognition {
            request.requiresOnDeviceRecognition = true
        }
        self.request = request

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playAndRecord, mode: .default, options: [.duckOthers, .defaultToSpeaker])
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        Self.installTap(on: audioEngine, feeding: request)
        audioEngine.prepare()
        try audioEngine.start()

        task = Self.recognize(with: recognizer, request: request) { [weak self] text in
            Task { @MainActor in
                self?.transcript = text
            }
        }
    }

    /// Stopt met luisteren en geeft de herkende tekst terug.
    func stop() async -> String {
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        request?.endAudio()
        // Geef de herkenner even tijd om het laatste woord af te maken.
        try? await Task.sleep(nanoseconds: 500_000_000)
        let text = transcript
        cancel()
        return text
    }

    func cancel() {
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
        }
        task?.cancel()
        task = nil
        request = nil
    }

    // Deze closures draaien op achtergrond-threads en staan daarom buiten de main actor.
    private nonisolated static func installTap(on engine: AVAudioEngine, feeding request: SFSpeechAudioBufferRecognitionRequest) {
        let input = engine.inputNode
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 1024, format: input.outputFormat(forBus: 0)) { buffer, _ in
            request.append(buffer)
        }
    }

    private nonisolated static func recognize(
        with recognizer: SFSpeechRecognizer,
        request: SFSpeechAudioBufferRecognitionRequest,
        onText: @escaping @Sendable (String) -> Void
    ) -> SFSpeechRecognitionTask {
        recognizer.recognitionTask(with: request) { result, _ in
            if let result {
                onText(result.bestTranscription.formattedString)
            }
        }
    }
}
