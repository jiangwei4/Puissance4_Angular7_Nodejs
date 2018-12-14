const fs = require('fs')

class DB {
    constructor() {
        this.data = null;
        this.initialized = false;
        this.file = null;
    }
    get(key) {
        if (!this.initialized) {
            throw new Error('DB :: Uninitialized database');
        }
        return this.data[key]
    }
    set(key, value) {
        if (!this.initialized) {
            throw new Error('DB :: Uninitialized database');
        }
        this.data[key] = value
        this.write()
    }
    write(data) {
        return new Promise((resolve, reject) => {
            data = data ? data : this.data
            fs.writeFile(this.file, JSON.stringify(this.data), (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
    initSync(filename) {
        this.file = filename
        try {
            const data = fs.readFileSync(filename)
            this.data = JSON.parse(data)
            this.initialized = true
            return this.data
        } catch (error) {
            fs.writeFileSync(filename, '{}')
            this.data = {}
            this.initialized = true;
            return this.data
        }
    }
    init(filename) {
        return new Promise((resolve, reject) => {
            this.file = filename;
            fs.readFile(filename, (error, data) => {
                if (error) {
                    if (error.errno && error.errno == -2) {
                        fs.writeFile(filename, '{}', (error) => {
                            if (error) {
                                reject(error)
                            } else {
                                this.data = {}
                                this.initialized = true;
                                resolve(this.data);
                            }
                        })
                    } else {
                        reject(error)
                    }
                } else {
                    this.data = JSON.parse(data)
                    this.initialized = true
                    resolve(this.data)
                }
            })
        })
    }
}

module.exports = new DB()
