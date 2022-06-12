package com.ab.shekelapp.entity;

import com.ab.shekelapp.entity.general.Worker;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class Coordinator extends Worker implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToOne(mappedBy = "coordinator", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private WidthGuide widthGuide;

    @OneToMany(mappedBy = "coordinator", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Apartment> apartments;

    public Coordinator() {
        // Empty.
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public List<Apartment> getApartments() {
        return apartments;
    }

    public void setApartments(List<Apartment> apartments) {
        this.apartments = apartments;
    }

    public WidthGuide getWidthGuide() {
        return widthGuide;
    }

    public void setWidthGuide(WidthGuide widthGuide) {
        this.widthGuide = widthGuide;
    }

}
