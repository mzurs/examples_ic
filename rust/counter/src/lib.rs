mod test;

use candid::types::number::Nat;
use ic_cdk_macros::{export_candid, query, update};
use std::cell::RefCell;

std::thread_local! {

    static COUNTER:RefCell<Nat> = RefCell::new(Nat::from(0 as u32));

}

fn guard_function() -> Result<(), String> {
    ic_cdk::println!("{}", ic_cdk::caller());
    if ic_cdk::caller().to_text() == "aaa-aaa" {
        Ok(())
    } else {
        Err(String::from("Unknown Principal Not Allowed"))
    }
}

#[query(guard=guard_function)]
fn get_counts() -> Nat {
    COUNTER.with(|counter: &RefCell<Nat>| (*counter.borrow()).clone())
}

#[update]
fn increment_count() -> () {
    COUNTER.with(|counter: &RefCell<Nat>| *counter.borrow_mut() += 1u32);
}

export_candid!();
