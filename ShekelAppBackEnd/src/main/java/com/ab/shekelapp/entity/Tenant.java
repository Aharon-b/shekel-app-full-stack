package com.ab.shekelapp.entity;

import com.ab.shekelapp.data.LocalDateConverter;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String workPlace;

    private String description;

    @AttributeOverrides({
            @AttributeOverride(name = "first_name", column = @Column(name = "first_name")),
            @AttributeOverride(name = "last_name", column = @Column(name = "last_name")),
            @AttributeOverride(name = "phone_number", column = @Column(name = "phone_number")),
            @AttributeOverride(name = "gender", column = @Column(name = "gender")),
            @AttributeOverride(name = "image", column = @Column(name = "image")),
    })
    @Embedded
    private ShekelMember shekelMember;

    @Convert(converter = LocalDateConverter.class)
    private LocalDate birthDay;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "tenant", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private List<Medicine> medicines;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "tenant", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private List<Chore> chores;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    public Tenant() {
        // Empty.
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWorkPlace() {
        return workPlace;
    }

    public void setWorkPlace(String workPlace) {
        this.workPlace = workPlace;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Medicine> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<Medicine> medicines) {
        this.medicines = medicines;
    }

    public List<Chore> getChores() {
        return chores;
    }

    public void setChores(List<Chore> chores) {
        this.chores = chores;
    }

    @Transient
    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }

    public ShekelMember getShekelMember() {
        return shekelMember;
    }

    public void setShekelMember(ShekelMember shekelMember) {
        this.shekelMember = shekelMember;
    }

    public LocalDate getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

}
