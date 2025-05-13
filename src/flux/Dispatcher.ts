type Callback = (action: any) => void;

class Dispatcher {
    private callbacks: Callback[] = [];
    private isDispatching: boolean = false;
    private pendingPayload: any = null;

    register(callback: Callback): string {
        this.callbacks.push(callback);
        return callback.toString();
    }

    unregister(id: string): void {
        const index = this.callbacks.findIndex(cb => cb.toString() === id);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }

    dispatch(action: any): void {
        if (this.isDispatching) {
            throw new Error('Cannot dispatch in the middle of a dispatch');
        }

        this.isDispatching = true;
        this.pendingPayload = action;

        try {
            this.callbacks.forEach(callback => {
                callback(this.pendingPayload);
            });
        } finally {
            this.isDispatching = false;
            this.pendingPayload = null;
        }
    }
}

export const dispatcher = new Dispatcher();
