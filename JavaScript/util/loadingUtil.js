function setContentLoading(container, isLoading) {
    if (isLoading) {
        container.classList.add("loading"); 
    } else {
        container.classList.remove("loading");
    }
}