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
        // Tạo độ dài và rộng ngẫu nhiên
        int length = rand() % 100 + 1;  // Tạo số ngẫu nhiên từ 1 đến 100
        int width = rand() % 100 + 1;

        // Ghi input vào file
        ofstream inputFile("input/input" + string(2 - to_string(i).length(), '0') + to_string(i) + ".txt");
        inputFile << length << " " << width << endl;
        inputFile.close();

        // Tính chu vi và diện tích
        int perimeter = 2 * (length + width);
        int area = length * width;

        // Ghi output vào file
        ofstream outputFile("output/output" + string(2 - to_string(i).length(), '0') + to_string(i) + ".txt");
        outputFile << perimeter << " " << area << endl;
        outputFile.close();
    }

    return 0;
}

