import SwiftUI
import Translation

struct ContentView: View {
    @StateObject private var recognizer = SpeechRecognizer()
    @State private var speaker = Speaker()

    @State private var listening: Language?
    @State private var busy = false
    @State private var sourceLanguage: Language = .dutch
    @State private var original = ""
    @State private var translated = ""
    @State private var message: String?

    // Vertaalopdracht voor de translationTask hieronder.
    @State private var configuration: TranslationSession.Configuration?
    @State private var configuredSource: Language?
    @State private var pendingText: String?

    @State private var packsInstalled = false
    @State private var onDeviceSpeech = true

    var body: some View {
        VStack(spacing: 16) {
            if !packsInstalled {
                Button("Taalpakketten downloaden voor offline gebruik") {
                    requestTranslation(of: nil, from: .dutch)
                }
                .buttonStyle(.bordered)
            }
            if !onDeviceSpeech {
                Text("Let op: spraakherkenning op het toestel is niet voor beide talen beschikbaar. Zonder internet werkt luisteren dan niet.")
                    .font(.footnote)
                    .foregroundStyle(.orange)
            }

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    textBlock(title: sourceLanguage.name, text: listening != nil ? recognizer.transcript : original)
                    textBlock(title: sourceLanguage.other.name, text: translated, large: true)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            if let message {
                Text(message)
                    .font(.footnote)
                    .foregroundStyle(.red)
            }

            if !translated.isEmpty && listening == nil {
                Button {
                    speaker.speak(translated, in: sourceLanguage.other)
                } label: {
                    Label("Opnieuw afspelen", systemImage: "speaker.wave.2.fill")
                }
            }

            HStack(spacing: 12) {
                ForEach(Language.allCases) { language in
                    talkButton(for: language)
                }
            }
        }
        .padding()
        .translationTask(configuration) { session in
            await runTranslation(with: session)
        }
        .task {
            await refreshStatus()
        }
    }

    private func textBlock(title: String, text: String, large: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(text.isEmpty ? "…" : text)
                .font(large ? .title : .title3)
                .fontWeight(large ? .semibold : .regular)
                .textSelection(.enabled)
        }
    }

    private func talkButton(for language: Language) -> some View {
        let isListening = listening == language
        return Button {
            Task { await toggle(language) }
        } label: {
            VStack(spacing: 8) {
                Image(systemName: isListening ? "stop.fill" : "mic.fill")
                    .font(.title)
                Text(isListening ? "Stop" : language.name)
                    .font(.headline)
            }
            .frame(maxWidth: .infinity, minHeight: 110)
        }
        .buttonStyle(.borderedProminent)
        .tint(isListening ? .red : (language == .dutch ? .orange : .blue))
        .disabled(busy || (listening != nil && !isListening))
    }

    private func toggle(_ language: Language) async {
        message = nil
        if listening == language {
            busy = true
            let text = await recognizer.stop()
            listening = nil
            busy = false
            original = text
            guard !text.isEmpty else {
                message = "Ik heb niets verstaan. Probeer het opnieuw."
                return
            }
            requestTranslation(of: text, from: language)
        } else {
            speaker.stop()
            guard await SpeechRecognizer.requestPermissions() else {
                message = "Geef toegang tot microfoon en spraakherkenning via Instellingen."
                return
            }
            do {
                sourceLanguage = language
                translated = ""
                try recognizer.start(language: language)
                listening = language
            } catch {
                message = error.localizedDescription
            }
        }
    }

    /// Start een vertaling; met `text == nil` worden alleen de taalpakketten opgehaald.
    private func requestTranslation(of text: String?, from source: Language) {
        pendingText = text
        if configuredSource == source, configuration != nil {
            configuration?.invalidate()
        } else {
            configuredSource = source
            configuration = TranslationSession.Configuration(
                source: source.translationLanguage,
                target: source.other.translationLanguage
            )
        }
    }

    private func runTranslation(with session: TranslationSession) async {
        do {
            guard let text = pendingText else {
                try await session.prepareTranslation()
                await refreshStatus()
                return
            }
            pendingText = nil
            let response = try await session.translate(text)
            translated = response.targetText
            if let target = configuredSource?.other {
                speaker.speak(response.targetText, in: target)
            }
            await refreshStatus()
        } catch {
            message = "Vertalen lukte niet: \(error.localizedDescription)"
        }
    }

    private func refreshStatus() async {
        let availability = LanguageAvailability()
        let forward = await availability.status(from: Language.dutch.translationLanguage, to: Language.spanish.translationLanguage)
        let backward = await availability.status(from: Language.spanish.translationLanguage, to: Language.dutch.translationLanguage)
        packsInstalled = forward == .installed && backward == .installed
        onDeviceSpeech = Language.allCases.allSatisfy { SpeechRecognizer.supportsOnDevice($0) }
    }
}
