//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Library {
    uint256 public bookId; 
    mapping(uint256 => mapping(uint256 => uint256)) payLog;
    struct Book {
        address payable author;
        uint256 price;
    }
    Book[] public books;

    function payAuthor(uint256 _bookId, uint256 _userId, uint256 value) external payable returns (uint256 perc) {
        require(msg.value == value, "Please send the correct amount!");
        require(msg.value > 0,"Please pay more than nothing");
        uint256 price = books[_bookId].price;
        uint256 prev = payLog[_userId][_bookId];
        require(msg.value <= (price - prev),"Payment is too high");
        address payable author = books[_bookId].author;
        require(payable(msg.sender) != author, "You shouldn't pay yourself");
        payLog[_userId][_bookId] += value; 
        author.transfer(msg.value);
        return (payLog[_userId][_bookId] * 100) / books[_bookId].price; // percentage of book paid
    }

    function addFakeBook(address payable author, uint256 price) public {
        require(bookId < 42, "Maximum number of addFakeBook calls reached");
        add(author, price);
    }

    function addBook(uint256 price) public {
        add(payable(msg.sender), price);
    }
    
    function add(address payable author, uint256 price) internal {
        require(price % 50  == 0, "Price not divisible by 50");
        require(price >= 200, "Price too low");
        require(price <= 500, "Price too high");
        Book memory b = Book(author, price);
        books.push(b);
        emit NewBook(bookId++);
    }

    function removeBook(uint256 _bookId) public {
        require(_bookId < bookId, "Incorrect bookId");
        address payable author = books[_bookId].author;
        require(msg.sender == author, "You're not allowed to delete this book");

        books[_bookId] = books[books.length - 1]; // overwrite item with last book item and then delete last
        books.pop();
        emit NewBook(bookId--);
    }

    // events
    event NewBook(uint256 indexed bookId);

}
