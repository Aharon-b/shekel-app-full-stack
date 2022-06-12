package com.ab.shekelapp.entity.general;

import com.ab.shekelapp.common.ApartmentsAndTenantsGender;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Lob;
import java.io.IOException;

public class ShekelMember {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private ApartmentsAndTenantsGender gender;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Lob
    private Byte[] image;

    public ShekelMember() {
        // Empty
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public ApartmentsAndTenantsGender getGender() {
        return gender;
    }

    public void setGender(ApartmentsAndTenantsGender gender) {
        this.gender = gender;
    }


    public Byte[] getImage() {
        return image;
    }

    public void setImage(Byte[] image) {
        this.image = image;
    }

    public void setFileImage(MultipartFile file) {
        try {
            Byte[] byteObjects = new Byte[file.getBytes().length];

            int i = 0;

            for (byte b : file.getBytes()) {
                byteObjects[i++] = b;
            }

            setImage(byteObjects);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
