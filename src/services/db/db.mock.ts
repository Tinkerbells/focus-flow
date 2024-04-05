interface Storable {
    id: string;
}

export class DB<T extends Storable> {
    private readonly storageKey: string;
    private readonly timeoutDuration: number;

    constructor(storageKey: string, timeoutDuration: number = 1500) {
        this.storageKey = storageKey;
        this.timeoutDuration = timeoutDuration;
    }

    private getAllItems(): T[] {
        const itemsString = localStorage.getItem(this.storageKey);
        return itemsString ? JSON.parse(itemsString) : [];
    }

    private saveAllItems(items: T[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    private async delay(ms: number): Promise<void> {
        return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }

    private isLocalStorageFull(): boolean {
        const data = JSON.stringify(localStorage);
        return data ? data.length >= 5 * 1024 * 1024 : false; // 5MB localStorage limit
    }

    async create(item: T): Promise<T> {
        await this.delay(this.timeoutDuration);
        if (this.isLocalStorageFull()) {
            throw new Error('Local storage is full');
        }

        const items = this.getAllItems();
        items.push(item);
        this.saveAllItems(items);
        return item;
    }

    async read(id: string): Promise<T | null> {
        await this.delay(this.timeoutDuration);
        const items = this.getAllItems();
        const foundItem = items.find((item) => item.id === id);
        return foundItem || null;
    }

    async update(updatedItem: T): Promise<T | null> {
        await this.delay(this.timeoutDuration);
        const items = this.getAllItems();
        const index = items.findIndex((item) => item.id === updatedItem.id);
        if (index !== -1) {
            items[index] = updatedItem;
            this.saveAllItems(items);
            return updatedItem;
        } else {
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        await this.delay(this.timeoutDuration);
        const items = this.getAllItems();
        const index = items.findIndex((item) => item.id === id);
        if (index !== -1) {
            items.splice(index, 1);
            this.saveAllItems(items);
            return true;
        } else {
            return false;
        }
    }
}

//  Example usage:
// interface User extends Storable {
//     name: string;
//     age: number;
// }
//
// const userDatabase = new Db<User>('users');
//
// async function exampleUsage() {
//     await userDatabase.create({ id: '1', name: 'Alice', age: 30 });
//     await userDatabase.create({ id: '2', name: 'Bob', age: 35 });
//
//     const user1 = await userDatabase.read('1');
//     console.log(user1); // Output: { id: '1', name: 'Alice', age: 30 }
//
//     await userDatabase.update({ id: '2', name: 'Bob', age: 36 });
//     const updatedUser2 = await userDatabase.read('2');
//     console.log(updatedUser2); // Output: { id: '2', name: 'Bob', age: 36 }
//
//     const isDeleted = await userDatabase.delete('1');
//     console.log(isDeleted); // Output: true
//
//     const nonExistentUser = await userDatabase.read('1');
//     console.log(nonExistentUser); // Output: null
// }
//
