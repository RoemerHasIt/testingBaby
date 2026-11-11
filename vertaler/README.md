# Vertaler

iPhone-app die gesproken Nederlands en Spaans naar elkaar vertaalt, zonder internet.

- Spraakherkenning: Apple Speech, op het toestel zelf
- Vertalen: Apple Translation (taalpakketten eenmalig downloaden)
- Uitspreken: de stemmen van iOS

Vereist iOS 18 of nieuwer.

## Bouwen

Het Xcode-project wordt gegenereerd met [XcodeGen](https://github.com/yonaskolb/XcodeGen):

```sh
brew install xcodegen
cd vertaler
xcodegen generate
open Vertaler.xcodeproj
```

Kies in Xcode bij *Signing & Capabilities* je eigen team, sluit je iPhone aan en druk op Run.

## Eerste gebruik (met internet)

1. Tik op "Taalpakketten downloaden voor offline gebruik".
2. Geef toegang tot microfoon en spraakherkenning.

Daarna werkt de app in vliegtuigmodus.
