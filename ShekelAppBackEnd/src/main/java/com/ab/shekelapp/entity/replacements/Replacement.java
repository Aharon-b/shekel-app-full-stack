package com.ab.shekelapp.entity.replacements;

import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Guide;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Replacement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "guide_id")
    private Guide guide;
    @AttributeOverrides({
            @AttributeOverride(name = "day", column = @Column(name = "start_day")),
            @AttributeOverride(name = "time", column = @Column(name = "start_time")),
    })
    @Embedded
    private ShiftTime start;

    @AttributeOverrides({
            @AttributeOverride(name = "day", column = @Column(name = "end_day")),
            @AttributeOverride(name = "time", column = @Column(name = "end_time")),
    })
    @Embedded
    private ShiftTime end;

    private String comments;

    private InApprovalProc inApprovalProc;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    public Replacement() {
        // Empty.
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Guide getGuide() {
        return guide;
    }

    public void setGuide(Guide guide) {
        this.guide = guide;
    }

    public ShiftTime getStart() {
        return start;
    }

    public void setStart(ShiftTime start) {
        this.start = start;
    }

    public ShiftTime getEnd() {
        return end;
    }

    public void setEnd(ShiftTime end) {
        this.end = end;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public InApprovalProc getInApprovalProc() {
        return inApprovalProc;
    }

    public void setInApprovalProc(InApprovalProc inApprovalProc) {
        this.inApprovalProc = inApprovalProc;
    }

    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Replacement that = (Replacement) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        /* 'start shift time ...(start day + time)
            end shift time ...(end day + time)' */
        String returnString = "תחילת משמרת " + start.getDay() + " " + start.getTime() + "\n" +
                "סיום משמרת " + end.getDay() + " " + end.getTime() + " \n";
        if (apartment != null) {
            /* 'start shift time ...(start day + time)
                end shift time ...(end day + time) in apartment ...(apartment name)' */
            returnString += " בדירת " + apartment.getName();
        }
        return returnString;
    }

}
