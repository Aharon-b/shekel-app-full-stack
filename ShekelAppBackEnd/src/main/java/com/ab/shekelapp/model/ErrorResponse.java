package com.ab.shekelapp.model;

/**
 * The class is responsible for creating all the exceptions in a similar way
 */
public class ErrorResponse {
    private final String message;
    private final long timestamp;

    public ErrorResponse(String message, long timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    /**
     * The function returns the class type.
     *
     * @param message The relevant error message.
     * @return the class type with the provided message.
     */
    public static ErrorResponse ofNow(String message) {
        return new ErrorResponse(message, System.currentTimeMillis());
    }

    public String getMessage() {
        return message;
    }

    public long getTimestamp() {
        return timestamp;
    }

}
