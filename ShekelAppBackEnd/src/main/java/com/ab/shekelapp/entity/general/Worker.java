package com.ab.shekelapp.entity.general;

import javax.persistence.*;

@MappedSuperclass
public class Worker {

    @AttributeOverrides({
            @AttributeOverride(name = "first_name", column = @Column(name = "first_name")),
            @AttributeOverride(name = "last_name", column = @Column(name = "last_name")),
            @AttributeOverride(name = "phone_number", column = @Column(name = "phone_number")),
            @AttributeOverride(name = "gender", column = @Column(name = "gender")),
            @AttributeOverride(name = "image", column = @Column(name = "image")),
    })
    @Embedded
    private ShekelMember shekelMember;

    @Column(unique = true)
    private String username;

    public Worker() {
        // Empty
    }

    public ShekelMember getShekelMember() {
        return shekelMember;
    }

    public void setShekelMember(ShekelMember shekelMember) {
        this.shekelMember = shekelMember;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void checkAndSetEmptyFields(ShekelMember systemMember) {

        if (shekelMember.getFirstName() == null || shekelMember.getFirstName().equals("")) {
            getShekelMember().setFirstName(systemMember.getFirstName());
        }

        if (shekelMember.getLastName() == null || shekelMember.getLastName().equals("")) {
            getShekelMember().setLastName(systemMember.getLastName());
        }

        if (shekelMember.getPhoneNumber() == null || shekelMember.getPhoneNumber().equals("")) {
            getShekelMember().setPhoneNumber(systemMember.getPhoneNumber());
        }
    }

}
