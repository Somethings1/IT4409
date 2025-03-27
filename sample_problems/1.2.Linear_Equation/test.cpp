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
        // Tạo hệ số a, b, c ngẫu nhiên, đảm bảo a khác 0
        int a = rand() % 10 + 1;  // Tạo a ngẫu nhiên trong khoảng [1, 10]
        int b = rand() % 21 - 10; // Tạo b ngẫu nhiên trong khoảng [-10, 10]
        int c = rand() % 21 - 10; // Tạo c ngẫu nhiên trong khoảng [-10, 10]

        // Ghi input vào file
        ofstream inputFile("input/input" + string(2 - to_string(i).length(), '0') + to_string(i) + ".txt");
        inputFile << a << " " << b << " " << c << endl;
        inputFile.close();

        // Tính nghiệm nếu có
        double x = (c - b) / (double)a;

        // Ghi output vào file
        ofstream outputFile("output/output" + string(2 - to_string(i).length(), '0') + to_string(i) + ".txt");
        outputFile << x << endl;
        outputFile.close();
    }

    return 0;
}
