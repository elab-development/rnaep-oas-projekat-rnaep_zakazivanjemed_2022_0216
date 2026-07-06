package com.medplatform.medical_records_service.util;

public final class InputSanitizer {

    private InputSanitizer() {}

    // Uklanja HTML/script tagove iz korisničkog unosa pre upisa u bazu.
    public static String clean(String input) {
        if (input == null) return null;
        return input
                .replaceAll("(?i)<script.*?>.*?</script>", "")
                .replaceAll("<[^>]+>", "")
                .trim();
    }
}