//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Library {
    uint256 public postId; // also getter for num posts (-1)
    uint256 public userId; 
    address public operator;

    mapping(uint256 => mapping(uint256 => uint256)) public progress;
    mapping(uint256 => mapping(uint256 => bool)) public writers; // writers user[i] follows
    mapping(uint256 => mapping(uint256 => bool)) public categories; // categories user[i] is subscribed to

    string[] public users;

    struct Post { // all book data except its content (which is in the post contract)
        string title;
        string intro;
        string visual; // demo images
        uint256 category; // id
        uint256 date; // timestamp
        address payable author; 
   }

    Post[] public posts;
    address[] public postContracts;

    constructor() {
        operator = msg.sender;
    }

    function payAuthor(uint256 _postId, uint256 price) external payable {
        require(
            msg.value == price,
            "Please pay the correct amount!"
        );

        address payable author = posts[_postId].author;
        author.transfer(msg.value);
    }

    function addPost(string memory title, string memory intro, string memory visual, uint256 category, uint256 date, address payable author) public onlyOperator returns (bool success) {
        Post memory post = Post(title, intro, visual, category, date, author);
        posts.push(post);
        emit NewPost(postId++);
        return true;
    }

    function removePost(uint256 _postId) public returns (bool success) {
        posts[_postId] = posts[posts.length - 1]; // overwrite item with last post item and then delete last
        posts.pop();
        return true;
    }

    function addPostContract(uint256 _postId, address _contractAddress) public onlyOperator returns (bool success) {
        postContracts[_postId] = _contractAddress;
        return true;
    }

    function addUser(string memory name) public onlyOperator() returns (bool success) {
        users.push(name);  
        emit NewUser(userId++);
        return true;
    }

    function updateProgress(uint256 _postId, uint256 _userId, uint256 value) public onlyOperator returns (bool success) {
        progress[_postId][_userId] = value;
        return true;
    }

    // lets user[i] follow or unfollow a writer
    function updateWriters(uint256 _userId, uint256 writerId, bool follow) public returns (bool success) {
        writers[_userId][writerId] = follow; 
        return true;
    } 

    // lets user[i] subscribe or unsubscribe from a category
    function updateCategories(uint256 _userId, uint256 categoryId, bool subscribe) public returns (bool success) {
        categories[_userId][categoryId] = subscribe; 
        return true;
    } 

    // modifiers


    modifier onlyOperator() {
        require(operator == msg.sender, "Only the operator can call this function");
        _;
    }

    // error OnlyAuthor();
    // modifier onlyAuthor(address author) {
    //     if(msg.sender != author) {
    //         revert OnlyAuthor();
    //     }
    //     _;
    // }

    // events

    event NewPost(uint256 indexed postId);
    event NewUser(uint256 indexed userId);

}
