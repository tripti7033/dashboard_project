import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organisation {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    organisationData: string;

}