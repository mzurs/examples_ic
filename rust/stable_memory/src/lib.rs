use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk_macros::{export_candid, query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::borrow::Cow;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static USERS_MAP:RefCell<StableBTreeMap<String,String,Memory>>=RefCell::new(StableBTreeMap::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))));
}

#[derive(Clone, CandidType, Debug, Deserialize)]
struct User {
    id: String,
    uuid: String,
    name: String,
}

impl Storable for User {
    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    const BOUND: Bound = Bound::Unbounded;
}

#[query]
fn get_user(key: Principal) -> Option<String> {
    USERS_MAP.with(|value| value.borrow().get(&key.to_text()))
}

#[update]
fn add_user(value: String) -> Option<String> {
    USERS_MAP.with(|val| {
        val.borrow_mut()
            .insert(ic_cdk::caller().to_text(), value.to_string())
    });

    let user: Option<String> =
        USERS_MAP.with(|value| value.borrow().get(&ic_cdk::caller().to_text()));

    user
}


export_candid!();
