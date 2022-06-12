package com.ab.shekelapp.entity;

import com.ab.shekelapp.entity.general.Worker;

import javax.persistence.*;

@Entity
public class WidthGuide extends Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "coordinator_id")
    private Coordinator coordinator;

    public WidthGuide() {
        // Empty.
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Coordinator getCoordinator() {
        return coordinator;
    }

    public void setCoordinator(Coordinator coordinator) {
        this.coordinator = coordinator;
    }

}
