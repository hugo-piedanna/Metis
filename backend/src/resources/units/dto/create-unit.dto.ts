import { IsEnum, IsString } from "class-validator";
import { UnitType } from "@/resources/units/entities/unit.entity";

export class CreateUnitDto {

    @IsString()
    code: string;

    @IsString()
    label: string;

    @IsEnum(UnitType)
    type: UnitType;
}
