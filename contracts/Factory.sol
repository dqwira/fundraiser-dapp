// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

//mengimpor kontrak Fundraiser yang didefinisikan sebelumnya
import "./Fundraiser.sol";

contract Factory {
    // mendefinisikan konstanta maxLimit yang menyimpan batas maksimum item yang dapat dikembalikan dari metode fundraisers()
    uint256 constant maxLimit = 20;
    
    //mendefinisikan array _fundraisers yang akan menyimpan semua kontrak Fundraiser yang dibuat.
    Fundraiser[] private _fundraisers;

    /*event FundraiserCreated dipanggil setiap kali kontrak Fundraiser baru dibuat. Event ini berisi dua field indeks, yaitu fundraiser dan owner, yang menyimpan alamat dari kontrak Fundraiser yang baru dibuat dan alamat pemilik kontrak, masing-masing. */
    event FundraiserCreated(
        Fundraiser indexed fundraiser,
        address indexed owner
    );

    /*metode fundraisersCount() dapat dipanggil oleh pengguna untuk mengetahui jumlah kontrak Fundraiser yang telah dibuat. Metode ini mengembalikan panjang array _fundraisers, yang merupakan jumlah kontrak yang ada di dalamnya. */    
    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }

    /*metode createFundraiser() dapat dipanggil oleh pengguna untuk menciptakan kontrak Fundraiser baru. Metode ini menerima parameter yang berisi detail kontrak Fundraiser yang akan dibuat, lalu menciptakan kontrak baru dan menambahkannya ke array _fundraisers. Metode ini juga mengeluarkan event FundraiserCreated untuk mencatat pembuatan kontrak ini di blockchain. */
    function createFundraiser(
        string memory name,
        string memory description,
        string memory url,
        string memory imageURL,
        address payable beneficiary
    ) public {
        Fundraiser fundraiser = new Fundraiser(
            name,
            description,
            url,
            imageURL,
            beneficiary,
            msg.sender
        );
        _fundraisers.push(fundraiser);
        emit FundraiserCreated(fundraiser, msg.sender);
    }

    /*metode fundraisers() dapat dipanggil oleh pengguna untuk mengembalikan daftar kontrak Fundraiser yang telah dibuat. Metode ini menerima dua parameter, yaitu limit dan offset, yang menunjukkan jumlah item yang dikembalikan dan offset dari daftar, masing-masing. Metode ini memulai dengan memverifikasi bahwa offset yang diberikan tidak melebihi jumlah kontrak yang ada menggunakan statement require(). */
    function fundraisers(uint256 limit, uint256 offset)
        public
        view
        returns (Fundraiser[] memory coll)
    {
        require(offset <= fundraisersCount(), "offset out of bounds");

        // menghitung panjang daftar yang akan dikembalikan sebagai selisih antara jumlah total kontrak dan offset yang diberikan.
        uint256 size = fundraisersCount() - offset;

        //  memverifikasi bahwa panjang daftar yang dikembalikan tidak melebihi limit yang diberikan. Jika ya, panjang daftar akan diatur sesuai limit yang diberikan.
        size = size < limit ? size : limit;

        // memverifikasi bahwa panjang daftar yang dikembalikan tidak melebihi maxLimit yang telah didefinisikan sebelumnya. Jika ya, panjang daftar akan diatur sesuai maxLimit.
        size = size < maxLimit ? size : maxLimit;

        /*Bagian ini merupakan implementasi dari metode fundraisers() yang digunakan untuk membangun dan mengembalikan daftar kontrak Fundraiser. Pertama, metode ini membuat array baru bernama coll dengan panjang sesuai dengan panjang yang telah ditentukan sebelumnya. Kemudian, metode ini melakukan looping sebanyak panjang daftar dan menambahkan setiap item dari daftar ke array coll dengan menggunakan offset yang diberikan sebagai parameter untuk menentukan posisi item dalam daftar. Setelah selesai, metode ini mengembalikan daftar coll yang telah dibuat */
        coll = new Fundraiser[](size);
        for (uint256 i = 0; i < size; i++) {
            coll[i] = _fundraisers[offset + i];
        }
        return coll;
    }
}
