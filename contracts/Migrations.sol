// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

//kontrak Migrations digunakan untuk mengelola proses migrasi (pembaruan) kontrak.
contract Migrations {
    
    /* Kontrak ini memiliki dua field publik, yaitu owner dan last_completed_migration, yang menyimpan alamat pemilik kontrak dan nomor migrasi terakhir yang telah selesai dilakukan, masing-masing.  */
    address public owner;
    uint256 public last_completed_migration;

    /* modifier restricted digunakan oleh metode-metode dalam kontrak ini untuk memverifikasi bahwa hanya pemilik kontrak yang dapat mengakses metode tersebut. Modifier ini akan memeriksa apakah pengirim pesan (msg.sender) sama dengan alamat pemilik kontrak (owner), dan jika ya, akan mengeksekusi kode di bawahnya dengan menggunakan operator _. */
    modifier restricted() {
        if (msg.sender == owner) _;
    }

    //Konstruktor ini menyimpan alamat pengirim pesan (msg.sender) ke field owner sebagai alamat pemilik kontrak.
    constructor() {
        owner = msg.sender;
    }

    /*metode setCompleted() digunakan untuk menyimpan nomor migrasi terakhir yang telah selesai dilakukan ke field last_completed_migration. Metode ini memiliki parameter bernama completed yang berisi nomor migrasi yang akan disimpan. Metode ini menggunakan modifier restricted untuk memverifikasi bahwa hanya pemilik kontrak yang dapat mengakses metode ini. Jika verifikasi berhasil, metode ini akan menyimpan nilai dari parameter completed ke field last_completed_migration. */
    function setCompleted(uint256 completed) public restricted {
        last_completed_migration = completed;
    }
}
