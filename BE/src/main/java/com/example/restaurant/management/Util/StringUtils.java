package com.example.restaurant.management.Util;

public class StringUtils {

    public static String capitalizeEachWord(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        String[] words = str.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        return result.toString().trim();
    }
}
