import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Geography{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    geograpgyData : string;
}