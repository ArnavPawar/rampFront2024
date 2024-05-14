import { useState, useCallback } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent, SetTransactionApprovalFunction } from "./types"
import { useCustomFetch } from "src/hooks/useCustomFetch"

export const TransactionPane: TransactionPaneComponent = ({ transaction, loading }) => {
  const [approved, setApproved] = useState(transaction.approved)
  const { fetchWithoutCache, clearCache } = useCustomFetch()

  const setTransactionApproval = useCallback(
    async (transactionId: string, newValue: boolean) => {
      try {
        await clearCache()
        await fetchWithoutCache<void, { transactionId: string; value: boolean }>(
          "setTransactionApproval",
          { transactionId, value: newValue }
        )
      } catch (error) {
        console.error("Error setting transaction approval:", error)
      }
    },
    [fetchWithoutCache, clearCache]
  )

  const saveTransaction = useCallback(
    async ({ transactionId, newValue }) => {
      await setTransactionApproval(transactionId, newValue)
    },
    [setTransactionApproval]
  )

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          await saveTransaction({ transactionId: transaction.id, newValue })
          setApproved(newValue)
        }}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
