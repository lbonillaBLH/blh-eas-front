const getLocalStorage = (name, uncompress = false)=>{
    return (uncompress) ? JSON.parse(localStorage.getItem(name)) : localStorage.getItem(name);
};

const setLocalStorage = (name, data, compress = false)=>{
    localStorage.setItem(name, (compress) ? JSON.stringify(data) : data);
};

const removeLocalStorage = (name)=>{
    localStorage.removeItem(name);
};

export { getLocalStorage, setLocalStorage, removeLocalStorage };