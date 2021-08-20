const avengersNames = [
    "Thor",
    "Cap",
    "Tony Stark",
    "Black Panther",
    "Black Widow",
    "Hulk",
    "Spider-Man",
]
let randomName = avengersNames[Math.floor(Math.random() * avengersNames.length)]

main()

async function main() {
    VoxeetSDK.initialize("lOfJlQThiT-Ocn4gLKgddQ==", "LDtSqNGRZo254GK7ufntF37giOJwVJUjwCqgg-L9xTA=")
    try {
        // Open the session here !!!!
        await VoxeetSDK.session.open({ name: randomName })
	initUI();
    } catch (e) {
        alert('Something went wrong : ' + e)
    }
}
