package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.entity.Medicine;
import com.ab.shekelapp.entity.Tenant;
import com.ab.shekelapp.repo.MedicineRepo;
import com.ab.shekelapp.service.interfaces.MedicineService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on medicine type.
 */
@Service
public class MedicineServiceProvider implements MedicineService {

    /* SQL queries on medicine type */
    private final MedicineRepo medicineRepo;

    @Autowired
    public MedicineServiceProvider(MedicineRepo medicineRepo) {
        this.medicineRepo = medicineRepo;
    }

    @Override
    public Medicine getMedicine(Long medicineId) {
        return medicineRepo.findById(medicineId).orElseThrow();
    }

    @Override
    public Medicine createMedicine(MultipartFile file, JSONObject medicineJson, Tenant tenant) {
        /* For setting details from the provided json */
        Medicine medicine = new Medicine();
        /* Setting details from the provided json */
        setMedicineDetails(medicine, tenant, medicineJson, false);
        /* Setting image from the provided file */
        setMedicineImage(file, medicine);
        /* Verifying that this is a new medicine by resetting the ID to 0 */
        medicine.setId(0);
        /* Saving data of new medicine in the data-base */
        return medicineRepo.save(medicine);
    }

    @Override
    public Medicine updateMedicine(MultipartFile file, Tenant tenant, JSONObject medicineJson) {
        /* For setting details from the provided json*/
        Medicine medicine = new Medicine();
        /* Setting details from the provided json */
        setMedicineDetails(medicine, tenant, medicineJson, true);
        /* Setting image from the provided file */
        setMedicineImage(file, medicine);
        /* Updating details in the data-base and returning the updated medicine details */
        return medicineRepo.save(medicine);
    }

    @Override
    public Medicine updateMedicineWithOutImage(Medicine medicine) {
        /* Attaching medicine to tenant */
        medicine.setTenant(medicine.getTenant());
        /* Updating details in the data-base and returning the updated medicine details */
        return medicineRepo.save(medicine);
    }

    @Override
    public List<Medicine> getTenantMedicineList(long tenantId) {
        /* Returning tenant's medicine list */
        return medicineRepo.findAllByTenantId(tenantId);
    }

    @Override
    public String deleteMedicineFromSystem(long medicineId) {
        /* Getting medicine details from the data-base */
        Medicine medicine = medicineRepo.findById(medicineId)
                /* 'medicine with provided details is not in the system' */
                .orElseThrow(() -> new NoSuchElementException("תרופה עם הנתונים שהוזנו לא נמצאת במערכת"));
        /* Deleting medicine from the data-base */
        medicineRepo.delete(medicine);
        /* 'medicine ...(medicine name) is deleted from the system' */
        return "התרופה " + medicine.getName() + " נמחקה מהמערכת ";
    }

    // Help functions:

    /**
     * A function for extracting new/updated medicine details from a json object
     * and setting them in the medicine object (for when creating a new medicine/updating medicine
     * details + image).
     *
     * @param medicine       the set the details to.
     * @param jsonAsMedicine to get details from.
     * @param update         for checking which details needs to be extracted form the json object.
     */
    private void setMedicineDetails(Medicine medicine, Tenant tenant, JSONObject jsonAsMedicine, boolean update) {
        try {
            if (update) {
                medicine.setId((Integer) jsonAsMedicine.get("id"));
            }
            medicine.setTenant(tenant);

            medicine.setName((String) jsonAsMedicine.get("name"));
            medicine.setTime((String) jsonAsMedicine.get("time"));
            medicine.setAmount(String.valueOf(jsonAsMedicine.get("amount")));
        } catch (JSONException ignore) {
        }
    }

    /**
     * A function for getting the bates from file and setting it has apartment image byte array.
     *
     * @param file     the image file.
     * @param medicine the apartment to set the image byte array.
     */
    public void setMedicineImage(MultipartFile file, Medicine medicine) {
        try {
            Byte[] byteObjects = new Byte[file.getBytes().length];

            int i = 0;

            for (byte b : file.getBytes()) {
                byteObjects[i++] = b;
            }
            medicine.setImage(byteObjects);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
