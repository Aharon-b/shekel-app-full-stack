package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Medicine;
import com.ab.shekelapp.entity.Tenant;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the medicine data-source.
 */
public interface MedicineService {

    /**
     * Getting medicine details by id.
     *
     * @param medicineId of the requested medicine.
     * @return the requested medicine.
     */
    Medicine getMedicine(Long medicineId);

    /**
     * Creating new medicine.
     *
     * @param file         new medicine image.
     * @param medicineJson new medicine details.
     * @param tenant       for attaching medicine to tenant's medicine list.
     * @return the new created medicine.
     */
    Medicine createMedicine(MultipartFile file, JSONObject medicineJson, Tenant tenant);

    /**
     * Updating medicine details + image.
     *
     * @param file         the new image.
     * @param medicineJson the new details.
     * @return updated medicine details.
     */
    Medicine updateMedicine(MultipartFile file, Tenant tenant, JSONObject medicineJson);

    /**
     * Updating medicine details.
     *
     * @param medicine the new details.
     * @return updated medicine details.
     */
    Medicine updateMedicineWithOutImage(Medicine medicine);

    /**
     * Getting tenant's medicine list.
     *
     * @param tenantId of the requested tenant.
     * @return tenant's medicine list.
     */
    List<Medicine> getTenantMedicineList(long tenantId);

    /**
     * Deleting medicine from the data-base.
     *
     * @param medicineId the deleted medicine.
     * @return success operation message.
     */
    String deleteMedicineFromSystem(long medicineId);

}
