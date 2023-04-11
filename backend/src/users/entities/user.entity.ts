import {Entity, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";


@Entity()
export class User {

    @PrimaryColumn()
    spotify_uri: string

    @ManyToMany(() => User)
    @JoinTable()
    following: User[]

}
