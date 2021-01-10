import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import CreateAddressDto from "../address/create-address.dto";

class UserDto {
    @IsString()
    @IsNotEmpty()
    public fullName!: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public password!: string;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}

export default UserDto;
