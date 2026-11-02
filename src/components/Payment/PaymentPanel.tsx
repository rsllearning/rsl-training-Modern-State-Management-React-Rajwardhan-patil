import React from 'react';
import { CheckoutContext } from '../../machines/CheckoutContext';

// Sibling panel sharing the checkout actor across the app
export const PaymentPanel: React.FC = () => {
  const actor = CheckoutContext.useActorRef();
  const isPaying = CheckoutContext.useSelector((state) => state.matches('payment'));
  const isSuccess = CheckoutContext.useSelector((state) => state.matches('success'));
  const canSubmit = CheckoutContext.useSelector((state) => state.can({ type: 'SUBMIT' }));
  const orderResult = CheckoutContext.useSelector((state) => state.context.orderResult);
  const error = CheckoutContext.useSelector((state) => state.context.errorMessage);
  const items = CheckoutContext.useSelector((state) => state.context.items);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="payment-panel-container" aria-label="Checkout Payment Panel">
      <div className="payment-panel-header">
        <h4>Checkout Workflow (XState v5)</h4>
        <span className={`status-pill ${isPaying ? 'paying' : isSuccess ? 'success' : 'idle'}`}>
          {isPaying ? 'Processing' : isSuccess ? 'Completed' : 'Review'}
        </span>
      </div>

      <div className="payment-panel-body">
        {/* Error notification */}
        {error && (
          <div className="panel-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* In-flight payment state */}
        {isPaying && (
          <div className="payment-active">
            <div className="spinner-small" />
            <p>Submitting order to /api/orders (1.5s delay)...</p>
            <button
              id="cancel-payment-btn"
              className="cancel-btn"
              onClick={() => actor.send({ type: 'CANCEL' })}
            >
              Cancel Payment (AbortSignal)
            </button>
          </div>
        )}

        {/* Order success state */}
        {isSuccess && orderResult && (
          <div className="payment-success">
            <p>🎉 Order confirmed! ID: #{orderResult.id}</p>
            <p>Total: ₹{orderResult.total.toLocaleString('en-IN')}</p>
            <button
              id="reset-order-btn"
              className="action-btn"
              onClick={() => actor.send({ type: 'RESET' })}
            >
              Done / Reset
            </button>
          </div>
        )}

        {/* Review step */}
        {!isPaying && !isSuccess && (
          <div className="payment-review">
            <p>Items in checkout: {items.length} (₹{total.toLocaleString('en-IN')})</p>
            <button
              id="submit-payment-btn"
              className="action-btn"
              disabled={!canSubmit}
              onClick={() => actor.send({ type: 'SUBMIT' })}
            >
              Submit Payment
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
