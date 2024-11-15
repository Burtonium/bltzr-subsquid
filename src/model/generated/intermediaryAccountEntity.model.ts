import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {UserDepositEntity} from "./userDepositEntity.model"

@Entity_()
export class IntermediaryAccountEntity {
    constructor(props?: Partial<IntermediaryAccountEntity>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    treasury!: string

    @OneToMany_(() => UserDepositEntity, e => e.intermediary)
    deposits!: UserDepositEntity[]
}
