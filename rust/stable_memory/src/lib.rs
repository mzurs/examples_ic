use candid::Principal;
use ic_cdk_macros::{query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Initialize a `StableBTreeMap` with `MemoryId(0)`.
    static MAP: RefCell<StableBTreeMap<u128, u128, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    static USERS_MAP:RefCell<StableBTreeMap<String,String,Memory>>=RefCell::new(StableBTreeMap::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))));
}

// Retrieves the value associated with the given key if it exists.
#[ic_cdk_macros::query]
fn get(key: u128) -> Option<u128> {
    MAP.with(
        |p: &RefCell<StableBTreeMap<u128, u128, VirtualMemory<std::rc::Rc<RefCell<Vec<u8>>>>>>| {
            p.borrow().get(&key)
        },
    )
}

// Inserts an entry into the map and returns the previous value of the key if it exists.
#[ic_cdk_macros::update]
fn insert(key: u128, value: u128) -> Option<u128> {
    MAP.with(
        |p: &RefCell<StableBTreeMap<u128, u128, VirtualMemory<std::rc::Rc<RefCell<Vec<u8>>>>>>| {
            p.borrow_mut().insert(key, value)
        },
    )
}

#[query]
fn get_user(key: Principal) -> Option<String> {
    USERS_MAP.with(
        |value: &RefCell<
            StableBTreeMap<String, String, VirtualMemory<std::rc::Rc<RefCell<Vec<u8>>>>>,
        >| value.borrow().get(&key.to_text()),
    )
}

#[update]
fn add_user(value: String) -> Option<String> {
    USERS_MAP.with(
        |val: &RefCell<
            StableBTreeMap<String, String, VirtualMemory<std::rc::Rc<RefCell<Vec<u8>>>>>,
        >| {
            val.borrow_mut()
                .insert(ic_cdk::caller().to_text(), value.to_string())
        },
    );

    let user: Option<String> = USERS_MAP.with(
        |value: &RefCell<
            StableBTreeMap<String, String, VirtualMemory<std::rc::Rc<RefCell<Vec<u8>>>>>,
        >| value.borrow().get(&ic_cdk::caller().to_text()),
    );

    user
}
