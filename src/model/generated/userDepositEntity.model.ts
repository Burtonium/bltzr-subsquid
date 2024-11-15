import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {IntermediaryAccountEntity} from "./intermediaryAccountEntity.model"

@Entity_()
export class UserDepositEntity {
    constructor(props?: Partial<UserDepositEntity>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    userAddress!: string

    @Index_()
    @ManyToOne_(() => IntermediaryAccountEntity, {nullable: true})
    intermediary!: IntermediaryAccountEntity

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    block!: bigint

    @BigIntColumn_({nullable: false})
    timestamp!: bigint
}
