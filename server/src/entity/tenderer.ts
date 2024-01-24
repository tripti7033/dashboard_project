import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tenderer {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tendererData: string

}