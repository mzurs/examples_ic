use ic_cdk::{
    api::{call_context_instruction_counter, instruction_counter, performance_counter},
    call, id,
};

/// Pretty print the `title` and a corresponding `tuple` with counters.
fn pretty_print<N: std::fmt::Display, T: std::fmt::Display>(title: N, counters: (T, T)) {
    ic_cdk::println!("{:40} {:<15} {:<15}", title, counters.0, counters.1);
}

/// Loop to simulate some amount of work.
fn do_some_work() {
    for i in 0..1_000_000 {
        // The black box hint is to avoid compiler optimizations for the loop.
        std::hint::black_box(i);
    }
}

/// Returns a tuple with all the performance counters.
fn counters() -> (u64, u64) {
    (instruction_counter(), call_context_instruction_counter())
}

/// Emulate a nested inter-canister update call.
#[ic_cdk_macros::update]
fn nested_update_call() -> (u64, u64) {
    counters()
}

/// Emulate a nested inter-canister composite query call.
#[ic_cdk_macros::query(composite = true)]
fn nested_composite_query_call() -> (u64, u64) {
    counters()
}

/// Emulate a nested inter-canister update call.
#[ic_cdk_macros::query]
fn nested_call() {}

////////////////////////////////////////////////////////////////////////
// Canister interface
////////////////////////////////////////////////////////////////////////

/// Example usage: `dfx deploy && dfx canister call performance_counters for_update`
#[ic_cdk_macros::update]
async fn for_update() -> (u64, u64) {
    do_some_work();
    let before = counters();

    let inside_1st: (u64, u64) = ic_cdk::call(ic_cdk::id(), "nested_update_call", ())
        .await
        .unwrap();

    do_some_work();
    let after_1st = counters();

    let inside_2nd: (u64, u64) = ic_cdk::call(ic_cdk::id(), "nested_update_call", ())
        .await
        .unwrap();

    do_some_work();
    let after_2nd = counters();

    pretty_print(
        "Performance counters for update call:",
        ("current (0)", "call context (1)"),
    );
    pretty_print("  before the nested call:", before);
    pretty_print("  > inside the 1st nested call:", inside_1st);
    pretty_print("  after the 1st nested call:", after_1st);
    pretty_print("  > inside the 2nd nested call:", inside_2nd);
    pretty_print("  after the 2nd nested call:", after_2nd);

    after_2nd
}

/// Example usage: `dfx deploy && dfx canister call performance_counters for_composite_query`
#[ic_cdk_macros::query(composite = true)]
async fn for_composite_query() -> (u64, u64) {
    do_some_work();
    let before = counters();

    let inside_1st: (u64, u64) = ic_cdk::call(ic_cdk::id(), "nested_composite_query_call", ())
        .await
        .unwrap();

    do_some_work();
    let after_1st = counters();

    let inside_2nd: (u64, u64) = ic_cdk::call(ic_cdk::id(), "nested_composite_query_call", ())
        .await
        .unwrap();

    do_some_work();
    let after_2nd = counters();

    pretty_print(
        "Perf. counters for composite query call:",
        ("current (0)", "call context (1)"),
    );
    pretty_print("  before the nested call:", before);
    pretty_print("  > inside the 1st nested call:", inside_1st);
    pretty_print("  after the 1st nested call:", after_1st);
    pretty_print("  > inside the 2nd nested call:", inside_2nd);
    pretty_print("  after the 2nd nested call:", after_2nd);

    after_2nd
}

/// Example usage: `dfx deploy && dfx canister call performance_counters example`
#[ic_cdk_macros::query(composite = true)]
async fn example() -> (u64, u64) {
    do_some_work();
    call::<(), ()>(id(), "nested_call", ()).await.unwrap();

    do_some_work();
    call::<(), ()>(id(), "nested_call", ()).await.unwrap();

    do_some_work();
    (performance_counter(0), performance_counter(1))
}