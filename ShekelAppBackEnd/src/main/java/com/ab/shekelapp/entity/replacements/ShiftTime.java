package com.ab.shekelapp.entity.replacements;

import com.ab.shekelapp.data.LocalDateConverter;

import javax.persistence.Convert;
import java.time.LocalDate;

public class ShiftTime {
    @Convert(converter = LocalDateConverter.class)
    private LocalDate day;
    private String time;

    public LocalDate getDay() {
        return day;
    }

    public void setDay(LocalDate day) {
        this.day = day;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

}
