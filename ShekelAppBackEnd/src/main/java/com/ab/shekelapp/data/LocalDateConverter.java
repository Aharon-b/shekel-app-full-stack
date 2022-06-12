package com.ab.shekelapp.data;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.Date;
import java.time.LocalDate;

@Converter
public class LocalDateConverter implements AttributeConverter<LocalDate, Date> {

    @Override
    public Date convertToDatabaseColumn(LocalDate att) {
        return att == null ? null : Date.valueOf(att);
    }

    @Override
    public LocalDate convertToEntityAttribute(Date att) {
        return att == null ? null : att.toLocalDate();
    }

}
