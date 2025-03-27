#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <filesystem>
using namespace std;
namespace fs = std::__fs::filesystem;

int main() {
    srand(time(0));  // Khởi tạo ngẫu nhiên

    // Kiểm tra và tạo thư mục nếu chưa có
    if (!fs::exists("input")) {
        fs::create_directory("input");
    }
    if (!fs::exists("output")) {
        fs::create_directory("output");
    }

    // Tạo 10 test case
    for (int i = 0; i < 10; i++) {
        // Tạo ký tự ngẫu nhiên từ a đến z
        char ch = 'a' + rand() % 26;

        // Ghi input vào file
        ofstream inputFile("input/input" + string(2 - to_string(i).length(), '0') + to_string(i) + ".txt");
        inputFile << ch << endl;
        inputFile.close();

        // Tính ký tự tiếp theo
        char next_ch = (ch == 'z') ? 'a' : ch + 1;

        // Ghi output vào file
        ofstream outputFile("output/output" + string(2 - to_string(i).length(), '0') + to_string(i) + ".txt");
        outputFile << next_ch << endl;
        outputFile.close();
    }

    return 0;
}

