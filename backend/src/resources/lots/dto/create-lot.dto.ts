import { IsDateString, IsNumber, Min } from "class-validator";

export class CreateLotDto {

    @IsNumber()
    @Min(1)
    quantity: number;

    // Expect ISO string (YYYY-MM-DD), you can format output to DD/MM/YYYY in responses
    @IsDateString()
    expirationDate: Date;
}
