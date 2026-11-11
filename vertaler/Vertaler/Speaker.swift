import AVFoundation

/// Spreekt tekst uit met de stemmen die op de iPhone staan (werkt offline).
final class Speaker {
    private let synthesizer = AVSpeechSynthesizer()

    func speak(_ text: String, in language: Language) {
        synthesizer.stopSpeaking(at: .immediate)
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: language.speechIdentifier)
        synthesizer.speak(utterance)
    }

    func stop() {
        synthesizer.stopSpeaking(at: .immediate)
    }
}
