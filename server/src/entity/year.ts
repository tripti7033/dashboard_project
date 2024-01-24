import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Year{
    
    @PrimaryGeneratedColumn()
    id: Number

    @Column()
    yearData: string
}