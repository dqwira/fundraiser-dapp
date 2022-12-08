// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

/*
library ini untuk mengatur akses ke smart contract dan melakukan operasi matematika yang aman.
*/
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

//membuat kontrak dengan mengimplementasikan library Ownable yang telah diimpor sebelumnya.
contract Fundraiser is Ownable {
    /*
    Ini adalah pernyataan using yang menyatakan bahwa semua operasi matematika yang dilakukan pada tipe uint256 akan ditangani oleh fungsi dari library SafeMath. Ini akan memastikan bahwa operasi matematika yang dilakukan pada bilangan bertipe uint256 tidak akan meluap atau mengalami kesalahan pembulatan.
    */
    using SafeMath for uint256;

    // Struktur ini digunakan untuk menyimpan data donasi yang diterima, termasuk jumlah dana yang diterima dan tanggal donasi dibuat.
    struct Donation {
        uint256 value;
        uint256 date;
    }

    // mengambil dan menyimpan data donasi menjadi array dari struktur Donation
    mapping(address => Donation[]) private _donations;

    //event akan mencatat perubahan ke blockchain
    //event DonationReceived akan dipicu ketika kontrak menerima donasi dari pengguna.Event ini mengambil alamat pengirim donasi dan jumlah donasi
    event DonationReceived(address indexed donor, uint256 value);

    //event Withdraw akan dipicu ketika kontrak mengirimkan dana ke alamat penerima yang ditetapkan. Event ini mengambil jumlah dana yang dikirim
    event Withdraw(uint256 amount);

    //event DetailsUpdated akan dipicu ketika pemilik kontrak memodifikasi detail donasi. Event ini mengambil nama, deskripsi, URL situs web, dan URL gambar yang baru
    event DetailsUpdated(
        string name,
        string description,
        string websiteURL,
        string imageURL
    );

    //deklarasi variabel yang menyimpan detail donasi. Variabel ini dapat diakses oleh semua pengguna dan dapat diubah oleh pemilik kontrak menggunakan metode updateDetails()
    string public name;
    string public description;
    string public url;
    string public imageURL;

    //variabel yang menyimpan alamat penerima dana. Variabel ini dapat diakses oleh semua pengguna dan dapat diubah oleh pemilik kontrak menggunakan metode setBeneficiary().
    address payable public beneficiary;

    //variabel yang menyimpan total dana yang diterima dan jumlah donasi yang diterima. Kedua variabel ini dapat diakses oleh semua pengguna.
    uint256 public totalDonations;
    uint256 public donationsCount;

    /*Konstruktor ini menerima parameter yang digunakan untuk mengatur detail donasi dan alamat penerima dana. Konstruktor juga menggunakan fungsi _transferOwnership() dari library Ownable untuk mengatur alamat pemilik kontrak ke alamat yang ditentukan sebagai parameter _custodian. */
    constructor(
        string memory _name,
        string memory _description,
        string memory _url,
        string memory _imageURL,
        address payable _beneficiary,
        address _custodian
    ) {
        name = _name;
        description = _description;
        url = _url;
        imageURL = _imageURL;
        beneficiary = _beneficiary;
        _transferOwnership(_custodian);
    }



    /* fungsi fallback akan dipanggil ketika kontrak menerima ether tanpa memanggil metode apa pun. Fungsi ini menambahkan jumlah dana yang diterima ke total donasi yang diterima dan meningkatkan hitungan donasi.*/
    fallback() external payable {
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
    }


    /*fungsi receive akan dipanggil ketika kontrak menerima ether menggunakan panggilan send() atau transfer() dari kontrak lain. Fungsi ini melakukan hal yang sama seperti fungsi fallback, yaitu menambahkan jumlah dana yang diterima ke total donasi yang diterima dan meningkatkan hitungan donasi. */
    receive() external payable {
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
    }

    /*metode updateDetails() dapat dipanggil oleh pemilik kontrak untuk memodifikasi detail donasi. Metode ini menerima parameter yang berisi informasi yang baru dan mengubah variabel yang sesuai. Metode ini juga mengeluarkan event DetailsUpdated untuk mencatat perubahan ini di blockchain. */
    function updateDetails(
        string calldata _name,
        string calldata _description,
        string calldata _url,
        string calldata _imageURL
    ) external onlyOwner {
        name = _name;
        description = _description;
        url = _url;
        imageURL = _imageURL;
        emit DetailsUpdated(name, description, url, imageURL);
    }


    /* metode setBeneficiary() dapat dipanggil oleh pemilik kontrak untuk mengubah alamat penerima dana. Metode ini menerima parameter yang berisi alamat yang baru dan mengubah variabel beneficiary sesuai. */
    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }


    /*metode myDonationsCount() dapat dipanggil oleh pengguna untuk mengetahui jumlah donasi yang telah dikirimkan oleh pengguna tersebut. Metode ini mengembalikan panjang array dari struktur Donation yang disimpan untuk alamat pengirim. */
    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }


    /*metode donate() dapat dipanggil oleh pengguna untuk mengirimkan dana ke kontrak. Metode ini menerima dana yang dikirim dan menambahkan data donasi ke array yang disimpan untuk alamat pengirim. Metode ini juga menambahkan jumlah dana yang diterima ke total donasi yang diterima dan meningkatkan hitungan donasi. Metode ini juga mengeluarkan event DonationReceived untuk mencatat donasi ini di blockchain. */
    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });
        _donations[msg.sender].push(donation);
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
        emit DonationReceived(msg.sender, msg.value);
    }

    /*metode myDonations() dapat dipanggil oleh pengguna untuk mengetahui jumlah dan tanggal dari donasi yang telah dikirimkan oleh pengguna tersebut. Metode ini mengembalikan tuple yang berisi dua array, yaitu array dari jumlah donasi dan array dari tanggal donasi. Karena Solidity tidak mendukung pengembalian struktur, oleh karena itu harus membangun tuple yang sesuai dengan skema struktur Donation yang disimpan.*/
    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }
        return (values, dates);
    }

    /*metode withdraw() dapat dipanggil oleh pemilik kontrak untuk mengirimkan dana yang ada di kontrak ke alamat penerima dana. Metode ini mengambil saldo kontrak dan mengirimkan jumlah tersebut ke alamat penerima dana. Metode ini juga mengeluarkan event Withdraw untuk mencatat penarikan ini di blockchain. */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        beneficiary.transfer(balance);
        // Emit event for logs
        emit Withdraw(balance);
    }
}
