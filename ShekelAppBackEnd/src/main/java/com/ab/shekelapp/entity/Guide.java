package com.ab.shekelapp.entity;

import com.ab.shekelapp.entity.general.Worker;
import com.ab.shekelapp.entity.replacements.Replacement;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
public class Guide extends Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(cascade = {CascadeType.PERSIST})
    @JoinTable(name = "apartment_guide", joinColumns =
    @JoinColumn(name = "guide_id"), inverseJoinColumns =
    @JoinColumn(name = "apartment_id"))
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Apartment> apartments;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "guide", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private List<Replacement> replacementRequests;

    public Guide() {
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

    public List<Replacement> getReplacementRequests() {
        return replacementRequests;
    }

    public void setReplacementRequests(List<Replacement> replacementRequests) {
        this.replacementRequests = replacementRequests;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Guide guide = (Guide) o;
        return Objects.equals(id, guide.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
