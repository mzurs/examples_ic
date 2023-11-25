use candid::types::number::Nat;
use ic_cdk_macros::{export_candid, query, update};
use std::cell::RefCell;

thread_local! {

    static COUNTER:RefCell<Nat> = RefCell::new(Nat::from(0 as u32));

}

#[query]
fn get_counts() -> Nat {
    COUNTER.with(|counter: &RefCell<Nat>| (*counter.borrow()).clone())
}

#[update]
fn increment_count() -> () {
    COUNTER.with(|counter: &RefCell<Nat>| *counter.borrow_mut() += 1u32);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init() {
        assert_eq!(get_counts(), Nat::from(0u32));
    }

    #[test]
    fn test_inc() {
        for i in 1..10 {
            increment_count();
            assert_eq!(get_counts(), Nat::from(i as u32));
        }
    }
}

export_candid!();
