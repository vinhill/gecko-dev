/*
 * Copyright 2016 Google Inc.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#ifndef SKSL_SYMBOL
#define SKSL_SYMBOL

#include "include/private/base/SkAssert.h"
#include "src/sksl/SkSLPosition.h"
#include "src/sksl/ir/SkSLIRNode.h"

#include <memory>
#include <string_view>

namespace SkSL {

class Context;
class Expression;
class Type;

/**
 * Represents a symbol table entry.
 */
class Symbol : public IRNode {
public:
    using Kind = SymbolKind;

    Symbol(Position pos, Kind kind, std::string_view name, const Type* type = nullptr)
        : INHERITED(pos, (int) kind)
        , fName(name)
        , fType(type) {
        SkASSERT(kind >= Kind::kFirst && kind <= Kind::kLast);
    }

    ~Symbol() override {}

    std::unique_ptr<Expression> instantiate(const Context& context, Position pos) const;

    const Type& type() const {
        SkASSERT(fType);
        return *fType;
    }

    Kind kind() const {
        return (Kind) fKind;
    }

    std::string_view name() const {
        return fName;
    }

    /**
     *  Don't call this directly--use SymbolTable::renameSymbol instead!
     */
    void setName(std::string_view newName) {
        fName = newName;
    }

private:
    std::string_view fName;
    const Type* fType;

    using INHERITED = IRNode;
};

}  // namespace SkSL

#endif
