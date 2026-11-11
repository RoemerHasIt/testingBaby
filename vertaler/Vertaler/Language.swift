import Foundation

enum Language: String, CaseIterable, Identifiable {
    case dutch
    case spanish

    var id: String { rawValue }

    var name: String {
        switch self {
        case .dutch: return "Nederlands"
        case .spanish: return "Español"
        }
    }

    /// Locale voor spraakherkenning en de stem.
    var speechIdentifier: String {
        switch self {
        case .dutch: return "nl-NL"
        case .spanish: return "es-ES"
        }
    }

    /// Taal voor het vertaalmodel.
    var translationLanguage: Locale.Language {
        switch self {
        case .dutch: return Locale.Language(identifier: "nl")
        case .spanish: return Locale.Language(identifier: "es")
        }
    }

    var other: Language {
        self == .dutch ? .spanish : .dutch
    }
}
