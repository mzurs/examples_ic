use ic_cdk_macros::query;

#[query]
fn get_name()->String{
    String::from("Hi, Muhammad Zohaib")
}

