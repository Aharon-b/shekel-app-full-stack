package com.ab.shekelapp.entity;

import com.ab.shekelapp.common.ApartmentsAndTenantsGender;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.List;

@Entity
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String name;

    @ManyToMany(cascade = {CascadeType.PERSIST})
    @JoinTable(name = "apartment_guide", joinColumns =
    @JoinColumn(name = "apartment_id"), inverseJoinColumns =
    @JoinColumn(name = "guide_id"))
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Guide> guides;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "apartment", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Tenant> tenants;

    @ManyToOne(cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "coordinator_id")
    private Coordinator coordinator;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Lob
    private Byte[] image;

    private String address;

    private String phoneNumber;

    private ApartmentsAndTenantsGender gender;

    public Apartment() {
        // Empty.
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public List<Guide> getGuides() {
        return this.guides;
    }

    public void setGuides(List<Guide> guides) {
        this.guides = guides;
    }

    public List<Tenant> getTenants() {
        return tenants;
    }

    public void setTenants(List<Tenant> tenants) {
        this.tenants = tenants;
    }

    public Coordinator getCoordinator() {
        return coordinator;
    }

    public void setCoordinator(Coordinator coordinator) {
        this.coordinator = coordinator;
    }

    public Byte[] getImage() {
        return image;
    }

    public void setImage(Byte[] image) {
        this.image = image;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ApartmentsAndTenantsGender getGender() {
        return gender;
    }

    public void setGender(ApartmentsAndTenantsGender gender) {
        this.gender = gender;
    }

}
