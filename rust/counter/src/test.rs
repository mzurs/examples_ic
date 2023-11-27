#[cfg(test)]
mod tests {
    use crate::*;

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

#[cfg(test)]
mod tests1 {
    use crate::*;

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