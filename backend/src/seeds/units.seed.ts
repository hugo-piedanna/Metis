import { Unit, UnitType } from "@/resources/units/entities/unit.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UnitsSeed {
    private readonly defaultUnits: Array<Partial<Unit>> = [
        // --- Mass ---
        { code: 'g', label: 'Gramme', type: UnitType.MASS },
        { code: 'kg', label: 'Kilogramme', type: UnitType.MASS },

        // --- Volume ---
        { code: 'ml', label: 'Millilitre', type: UnitType.VOLUME },
        { code: 'cl', label: 'Centilitre', type: UnitType.VOLUME },
        { code: 'l', label: 'Litre', type: UnitType.VOLUME },

        // --- Piece units ---
        { code: 'can', label: 'Canette', type: UnitType.PIECE },
        { code: 'jar', label: 'Bocal', type: UnitType.PIECE },
        { code: 'con', label: 'Conserve', type: UnitType.PIECE },
        { code: 'pot', label: 'Pot', type: UnitType.PIECE },
        { code: 'box', label: 'Boîte', type: UnitType.PIECE },
        { code: 'roll', label: 'Rouleau', type: UnitType.PIECE },
        { code: 'capsule', label: 'Capsule', type: UnitType.PIECE },
        { code: 'bar', label: 'Barre', type: UnitType.PIECE },
        { code: 'tube', label: 'Tube', type: UnitType.PIECE },
        { code: 'unit', label: 'Unité', type: UnitType.PIECE },
    ];

    constructor(
        @InjectRepository(Unit)
        private readonly unitRepo: Repository<Unit>,
    ) { }

    public async init() {
        for (const u of this.defaultUnits) {
            const exists = await this.unitRepo.findOne({ where: { code: u.code } });
            if (!exists) {
                await this.unitRepo.save(this.unitRepo.create(u));
            }
        }
    }
}
